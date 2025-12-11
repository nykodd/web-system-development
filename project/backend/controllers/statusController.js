import statusModel from '../models/statusModel.js';

export async function getStatuses(request, response) {
    const statuses = await statusModel.getStatuses();
    response.json(statuses);
}
export async function getStatusById(request, response) {
    const id = request.params.id;
    const status = await statusModel.getStatusById(id);
    response.json(status);
}
