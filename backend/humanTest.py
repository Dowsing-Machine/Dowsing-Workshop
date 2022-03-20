
from itertools import chain
import draco
import torch
import numpy as np
import torch.nn as nn
import torch.nn.functional as F

from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)


# action2num = {'user:update:x_encoding:nominal': 0,
#               'user:update:y_encoding:quantitative': 1,
#               'user:update:category_encoding:nominal': 2,
#               'user:update:filter:category_filter': 3,
#               'user:update:chart_type:point': 4,
#               'user:update:chart_type:line': 5,
#               'user:update:chart_type:bar': 6,
#               'user:update:aggregate:y_aggregate': 7,
#               'user:update:filter:x_filter': 8,
#               'user:update:x_encoding:quantitative': 9,
#               'user:update:chart_type:tick': 10,
#               'user:specify:alternative encoding': 11,
#               'user:specify:same': 12,
#               'user:update:y_encoding:nominal': 13,
#               'user:specify:summary': 14,
#               'user:update:category_encoding:quantitative': 15,
#               'user:update:category_encoding:None': 16,
#               'user:update:filter:y_filter': 17,
#               'user:update:y_encoding:None': 18,
#               'user:update:chart_type:None': 19,
#               'user:update:aggregate:x_aggregate': 20,
#               'user:specify:collection': 21,
#               'user:reset:query': 22,
#               'user:control:undo': 23,
#               'user:update:aggregate:category_aggregate': 24,
#               'user:update:x_encoding:None': 25,
#               'user:specify:add field': 26
#               }
action2num = {'user:update:x_encoding:time': 0,
              'user:update:y_encoding:quantitative': 1,
              'user:update:category_encoding:nominal': 2,
              'user:update:filter:category_filter': 3,
              'user:update:chart_type:point': 4,
              'user:update:chart_type:line': 5,
              'user:update:x_encoding:nominal': 6,
              'user:update:chart_type:bar': 7,
              'user:update:aggregate:y_aggregate': 8,
              'user:update:filter:x_filter': 9,
              'user:update:x_encoding:quantitative': 10,
              'user:update:chart_type:tick': 11,
              'user:specify:alternative encoding': 12,
              'user:specify:same': 13,
              'user:update:y_encoding:nominal': 14,
              'user:specify:summary': 15,
              'user:update:y_encoding:time': 16,
              'user:update:category_encoding:quantitative': 17,
              'user:update:category_encoding:time': 18,
              'user:update:category_encoding:None': 19,
              'user:update:filter:y_filter': 20,
              'user:update:y_encoding:None': 21,
              'user:update:chart_type:None': 22,
              'user:update:aggregate:x_aggregate': 23,
              'user:specify:collection': 24,
              'user:specify:collection': 24,
              'user:reset:query': 25,
              'user:control:undo': 26,
              'user:update:aggregate:category_aggregate': 27,
              'user:update:x_encoding:None': 28,
              'user:specify:add field': 29}

task2num = {
    '数据转换': 0,
    '关联': 1,
    '关联（趋势）': 2,
    '对比': 3,
    '确认': 4,
    '聚类': 5,
    '异常': 5
}

num2task = {
    0: '数据转换',
    1: '关联',
    2: '关联（趋势）',
    3: '对比',
    4: '确认值',
    5: '聚类/异常',
}

actionList = [0]*30
encodingList = [0]*30
typeList = [0]*30
aggList = [0]*30
otherList = [0]*30


class BLSTM(nn.Module):
    def __init__(self, seq_len, input_size, hidden_size, num_layers, num_tasks, bidirectional=True):
        super(BLSTM, self).__init__()

        # seq_len = 15, input_size = 12
        self.num_layers = num_layers
        self.num_directions = 2 if bidirectional == True else 1
        self.hidden_size = hidden_size

        self.blstm = nn.LSTM(input_size=input_size, hidden_size=hidden_size,
                             num_layers=num_layers, bidirectional=bidirectional)
        # self.blstm = nn.LSTM(input_size=15, hidden_size=24, num_layers=2, bidirectional=True)

        self.prediction = nn.Sequential(
            nn.Flatten(),
            nn.Linear(seq_len * hidden_size * self.num_directions, num_tasks),
            nn.Sigmoid()
        )

    def forward(self, x):

        # x (batch_size, seq_len, dimension)
        x = x.transpose(0, 1)   # (seq_len, batch_size, dimension)
        _, B, _ = x.shape  # B is batch_size
        # (num_layers * num_directions, batch_size, hidden_size), so (2 * 2, B, 24)
        c_0 = torch.randn(self.num_layers * self.num_directions,
                          B, self.hidden_size).to(gpu)
        h_0 = torch.randn(self.num_layers * self.num_directions,
                          B, self.hidden_size).to(gpu)

        out, (h_n, c_n) = self.blstm(x, (h_0, c_0))
        # out (seq_len, batch_size, hidden_size * num_directions)

        # (batch_size, seq_len, hidden_size * num_directions)
        out1 = self.prediction(out.transpose(0, 1))

        return out1


gpu = torch.device("cuda:1" if torch.cuda.is_available() else "cpu")
config = {
    'n_epochs': 50,
    'batch_size': 32,
    'seq_len': 30,
    'input_size': 27,
    'hidden_size': 45,
    'num_layers': 2,
    'num_tasks': 6,
    'bidirectional': True,
    'type': '9'
}
# model = torch.load("model/20220227_fold3.pth", map_location=gpu)
# model.eval()
models = [torch.load(
    f"model/20220227_fold{i}_coldboot(1).pth", map_location=gpu)for i in range(5)]
for model in models:
    model.eval()


# history={
#     '数据转换': [0,0,0],
#     '关联': [0,0,0],
#     '关联（趋势）': [0,0,0],
#     '对比': [0,0,0],
#     '确认值': [0,0,0],
#     '聚类/异常': [0,0,0],
# }
history = {
    '数据转换': 0,
    '关联': 0,
    '关联（趋势）': 0,
    '对比': 0,
    '确认值': 0,
    '聚类/异常': 0,
}


def print_pred(pred):
    res = []
    for n in num2task:
        res.append({
            "score": list(map(float, pred[:, n])),
            "type": num2task[n]
        })
    return res


last = print_pred(np.zeros((5, 6)))


@app.route("/reset")
def on_reset():
    global last, actionList, encodingList, typeList, aggList, otherList
    last = print_pred(np.zeros((5, 6)))
    actionList = [0]*30
    encodingList = [0]*30
    typeList = [0]*30
    aggList = [0]*30
    otherList = [0]*30


@app.route("/action")
def on_action():
    global last
    # print(request.args["topic"], action2num.get(request.args['topic'], "not found"))
    if action2num.get(request.args.get('topic')) is not None:
        t = request.args['topic']
        actionList.append(action2num[t]+1)
        if "encoding" in t:
            encodingList.append(action2num[t]+1)
        elif "chart_type" in t:
            typeList.append(action2num[t]+1)
        elif "aggregate" in t:
            aggList.append(action2num[t]+1)
        else:
            otherList.append(action2num[t]+1)

        opSeq = actionList[-15:]
        featSeq = []
        featSeq.extend(encodingList[-7:])
        featSeq.extend(typeList[-2:])
        featSeq.extend(aggList[-2:])
        featSeq.extend(otherList[-4:])
        inSeq = []
        inSeq.extend(opSeq)
        inSeq.extend(featSeq)
        x = torch.Tensor(np.array([np.eye(len(action2num)+1)[inSeq]]))
        pred_ys = np.array([model(x).detach().numpy()
                            for model in models]).squeeze()
        # pred_y = np.max(pred_ys, axis=0)
        # pred_y = model(x)
        print(t, inSeq)
        res = print_pred(pred_ys)
        last = res
    else:
        res = last
    return {
        "value": res
    }


@app.route("/draco", methods=["POST"])
def on_recommend():
    task_asps = [
        "soft(confirm_mark):- utask(confirm), not mark(line).",
        "soft(correlation_mark):- utask(correlation), mark(point).",
        "soft(trend_mark):- utask(trend), mark(line).",
        "soft(transform_aggregate_x):- utask(transform), encoding(E), channel(E,x), aggregate(E,_).",
        "soft(transform_aggregate_y):- utask(transform), encoding(E), channel(E,y), aggregate(E,_).",
        "soft(transform_aggregate_color):- utask(transform), encoding(E), channel(E,color), aggregate(E,_).",
        'soft(trend_aggregate_x):- utask(trend), encoding(E), channel(E,x),not aggregate(E,_).',
        'soft(trend_x_temporal):- utask(trend), encoding(E), field(E,F), type(E,temporal), channel(E,x).',
        'soft(correlation_x_quantitative):- utask(correlation), encoding(E), field(E,F), type(E,quantitative), channel(E,x).',
    ]

    task_weights = {
        "confirm_mark": 500,
        "correlation_mark": -500,
        "trend_mark": -666,
        "transform_aggregate_x": -727,
        "transform_aggregate_y": -181,
        "transform_aggregate_color": -848,
        "trend_aggregate_x": -100,
        "trend_x_temporal": -500,
        "correlation_x_quantitative": -200
    }

    weights_asps = [
        f"soft_weight({key},{value})." for key, value in task_weights.items()
    ]
    print(request.get_json(force=True))

    program = request.get_json(force=True)["asp"]
    program = program.split("\n")

    res = draco.run(
        chain(task_asps, weights_asps, program),

    )
    return {
        "cost": res.cost,
        "violations": res.violations,
        "vl": res.as_vl()
    }


app.run(port=5001, debug=True)
