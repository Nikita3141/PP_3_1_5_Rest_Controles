async function deleteUser (modal, id){
    let userJson =  await userFetch.findOneUser(id)
    let user =  userJson.json()

    modal.find('.modal-title').html('Delete User')

    let deleteButton = `<button class="btn btn-danger" id="deleteButton"> Delete</button>`
    let closeButton = `<button type="button" class="btn btn-success" id="deleteButton" data-dismiss="modal"> Close</button>`
    modal.find('.modal-footer').append(deleteButton)
    modal.find('.modal-footer').append(closeButton)

    user.then(user => {
        let bodyForm = `
        <div class="modal-body offset-md-2 col-md-8 text-center">
            <form class="form-group text-center" id="deleteUser">
                <div class="form-group">
                <label for="userId" class="col-form-label"><b>Id</b></label>
                <input type="text" id="userId" value="${user.id}"  class="form-control " disabled  >
                </div>

                <div class="form-group">
                <label for="username" class="col-form-label"><b>UserName</b></label>
                <input type="text" id="username" value="${user.username}"  class="form-control username" disabled>
                </div>

                <div class="form-group">
                <label for="lastname" class="col-form-label"><b>LastName</b></label>
                <input type="text" id="lastname" value="${user.lastname}"  class="form-control" disabled>
                </div>

                <div class="form-group">
                <label for="age" class="col-form-label"><b>Age</b></label>
                <input type="number" id="age" value="${user.age}"  class="form-control " disabled>
                </div>

                <div class="form-group">
                <label for="email" class="col-form-label"><b>Email</b></label>
                <input type="text" id="email" value="${user.email}"  class="form-control " disabled>
                </div>

                <div class="form-group">
                <label for="Role" class="col-form-label"></label>
                <select multiple id="Role" size="2" class="form-control" disabled>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                </div>
            </form>
        </div>
        `
        modal.find('.modal-body').append(bodyForm)
    })
    $(`#deleteButton`).on('click', async () => {
        const response = await userFetch.deleteUser(id)
        if (response.ok) {
            await getAllUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}