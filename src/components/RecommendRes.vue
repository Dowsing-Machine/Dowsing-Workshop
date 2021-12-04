<script>
import { defineComponent, h } from "vue";
import { NCollapse, NCollapseItem } from "naive-ui";
import Chart from "./ChartRaw.vue"

function isLeaf(node){
    return node&&!!node.items&&!!node.items[0].toSpec;
}

function createNode(resNode) {
    if(!resNode||!(resNode.items||resNode.toSpec)){return;}
    
    if (isLeaf(resNode)) {
        //到达叶子节点
        // console.log("leaf!",resNode.toSpec())
        return h(
            "div",
            [
                h(Chart, 
                    { vegalite: resNode.items[0].toSpec() },
                ),
                h(
                    NCollapse,
                    {
                        title:"show more"
                    },
                    [
                        h(
                            NCollapseItem,
                            {
                                title:"show more"
                            },
                            resNode.items.slice(1).map(item=>h(Chart, { vegalite: item.toSpec() }))
                        )
                    ]
                )
            ]
        )
    }
    else {
        return h(
            NCollapse,
            null,
            resNode.items.map(item => h(
                NCollapseItem,
                {
                    title: item.name
                },
                [
                    createNode(item)
                ]
            ))
        )
    }
}

export default defineComponent({
    render(props) {
        const result = this.result;
        // console.log(result);
        if(result!==null&&result.items){
            return createNode(result)
        }
        return createNode(result);
    },
    props: {
        result: Object
    },
    name: "RecommendRes"
})

</script>