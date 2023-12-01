const { db } = require('../../utils/db');

async function getMyLand(page, take, userId) {
    try {
        const landsRetrieved = await db.$transaction(async () => {
            const lands = await db.land.findMany({
                skip: take * (page - 1),
                take,
                where: {
                    userId,
                },
                orderBy:{
                    updatedAt: 'desc'
                }
            });
            return lands; 
        });
        return landsRetrieved;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function createLand(userId, name, address, ownership, area, varietas, dateStart, totalCost, profit, image, plant) {
    return db.land.create({
      data: {
        name,
        address,
        ownership,
        area,
        varietas,
        image,
        dateStart: new Date(dateStart), 
        totalCost,
        profit,
        plant,
        user: {
            connect: { id: userId }
        }
      }
    });
}

async function getSingleLand(landId){
    const land = await db.land.findUnique({
        where:{
            id: landId,
        },
    });
    if(!land){
        throw new Error ('Lahan tidak ditemukan!');
    }
    return land;
}

async function updateLand(landId, data){
    const land = await db.land.findUnique({
        where: {
            id: landId,
        },
    });

    if(!land){
        throw new Error ('Lahan tidak ditemukan!');
    }

    return db.land.update({
        where: {
            id: landId,
        },
        data: {
            ...data,
            dateStart: data.dateStart ? new Date(data.dateStart) : land.dateStart,
        },
    });
}

async function deleteLand(landId) {
    try {
        // Find the land and its related activities
        const land = await db.land.findUnique({
            where: {
                id: landId,
            },
            include: {
                activities: true,
            },
        });

        if (!land) {
            throw new Error('Lahan tidak ditemukan!');
        }

        // Delete all related activities
        const activityDeletions = land.activities.map(async (activity) => {
            await db.activity.delete({
                where: {
                    id: activity.id,
                },
            });
        });

        // Wait for all activity deletions to complete
        await Promise.all(activityDeletions);

        // Delete the land after all activities have been deleted
        await db.land.delete({
            where: {
                id: landId,
            },
        });

        // Return a success message or any other response as needed
        return { message: `Lahan dengan ID ${landId} dan aktivitas didalamnya telah dihapus.` };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getMyLand,
    createLand,
    getSingleLand,
    updateLand,
    deleteLand,

};