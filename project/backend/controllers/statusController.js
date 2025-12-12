import statusModel from '../models/statusModel.js';
import { statusSchema } from '../db/statusSchema.js';

export async function getStatuses(request, response) {
    const statuses = await statusModel.getStatuses();
    response.json(statuses);
}

export async function getStatusById(request, response) {
    const id = request.params.id;
    const status = await statusModel.getStatusById(id);
    if (!status) {
        return response.status(404).json({ error: 'Status not found' });
    }
    response.json(status);
}

// export async function createStatus(request, response) {
//     const result = statusSchema.safeParse(request.body);
//     if (result.error) {
//         return response.status(400).json(result.error.issues);
//     }
//     try {
//         const newStatus = await statusModel.createStatus(result.data);
//         response.status(201).json(newStatus);
//     } catch (error) {
//         response.status(500).json({ error: error.message });
//     }
// }

// export async function updateStatus(request, response) {
//     const id = request.params.id;
//     const result = statusSchema.safeParse(request.body);
//     if (result.error) {
//         return response.status(400).json(result.error.issues);
//     }
//     try {
//         const updatedStatus = await statusModel.updateStatus(id, result.data);
//         if (!updatedStatus) {
//             return response.status(404).json({ error: 'Status not found' });
//         }
//         response.json(updatedStatus);
//     } catch (error) {
//         response.status(500).json({ error: error.message });
//     }
// }

// export async function deleteStatus(request, response) {
//     const id = request.params.id;
//     try {
//         const deleted = await statusModel.deleteStatus(id);
//         if (!deleted) {
//             return response.status(404).json({ error: 'Status not found' });
//         }
//         response.status(204).send();
//     } catch (error) {
//         response.status(500).json({ error: error.message });
//     }
// }
