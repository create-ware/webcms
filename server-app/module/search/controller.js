const repository = require('./repository')


exports.search = async (req, res) => {
  let sessionUserId = req.session.user.id
  let sessionCustomerUserId = req.session.user.user_id
  let sessionUserRoleId = req.session.user.role_id
  let userDataResources = await repository.fetchRoleResourceDataById(sessionUserRoleId)
  let items = await repository.search(sessionUserId, sessionCustomerUserId, userDataResources, req.query.search)
  if (items.error) {
    res.code(500)
    await res.send({
      status_code: 1,
      status_msg: 'Error searching',
    })
    return res
  }
  await res.send({
    items: items,
  })
  return res
}
