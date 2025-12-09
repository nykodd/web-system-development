import userModel from '../models/userModel.js';

export async function getUsers(request, response) {
    const users = await userModel.getUsers();
    response.json(users);
}
export async function getUserById(request, response) {
    const id = request.params.id;
    const user = await userModel.getUserById(id);
    response.json(user);
}