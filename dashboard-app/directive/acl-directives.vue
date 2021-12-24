<script>
const ACL_DIRECTIVES = [
  {
    name: 'acl-show',
    action: {
      bind: (el, binding, vNode) => {
        let vNodeContext = vNode
        vNode.context.$socketIO.registerEvent(
          'role-resources-put',
          data => {
            if (!(window.user_data.get('role_id') === data.data.id))
              return

            window.user_data.set('role_resources', data.data.role_resources)
            if (!vNodeContext.context)
              return

            vNodeContext.context.$forceUpdate()
          },
        )
        vNode.context.$socketIO.registerEvent(
          'user-put',
          data => {
            if (window.user_data.get('id') === data.data.id)
              window.user_data.set(data.data)
            if (!vNodeContext.context)
              return

            vNodeContext.context.$forceUpdate()
          },
        )
        vNode.context.$aclReplaceVNode(el, binding, vNode)
      },
      update: (el, binding, vNode) => {
        vNode.context.$aclReplaceVNode(el, binding, vNode)
      },
    },
  },
]
export default {
  directives: ACL_DIRECTIVES,
}
</script>
