async function addUser () {
    $('#addUser').click(async () => {

        let addUserForm = $('#addForm')
        let username = addUserForm.find('#usernameCreate').val().trim()
        let lastname = addUserForm.find('#surnameCreate').val().trim()
        let age = addUserForm.find('#ageCreate').val().trim()
        let email = addUserForm.find('#emailCreate').val().trim()
        let password = addUserForm.find('#passwordCreate').val().trim()
        let checkedRoles = () => {
            let array = []
            let options = document.querySelector('#rolesCreate').options
            for ( let i =0; i < options.length; i++){
                if (options[i].selected){
                    array.push(roleList[i])
                }
            }
            return array
        }
        let data = {
            username: username ,
            lastname: lastname,
            age: age,
            email: email,
            password: password,
            roles: checkedRoles ()
        }
        const res = await userFetch.addUser (data)

        if(res.ok){
        await  getAllUsers ()
            addUserForm.find('#usernameCreate').val('')
            addUserForm.find('#surnameCreate').val('')
            addUserForm.find('#ageCreate').val('')
            addUserForm.find('#emailCreate').val('')
            addUserForm.find('#passwordCreate').val('')
            addUserForm.find(checkedRoles()).val('')

            $('#adminTable').addClass('show active');
            $('.nav-link:contains("Users Table")').tab('show');
            $('#newUser').removeClass('active');
        } else {
            let fuck = await res.json()
            let alert = ` 
                            <div class="alert alert-danger alert-dismissible fade show col-12 " role="alert" id="messageError">
                               ${fuck.info}
                 <button class="close" type="button" data-dismiss="alert" aria-label="Close">
                                 <span aria-hidden="true">&times;</span>
                 </button>
        
            </div>
                        `
            addUserForm.prepend(alert)
            const errorMessage = document.getElementById('messageError');

            const closeButton = errorMessage.querySelector('.close');

            closeButton.addEventListener('click', function() {
                errorMessage.style.display = 'none';
            });
        }

    })
}