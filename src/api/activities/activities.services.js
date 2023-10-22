const { db } = require('../../utils/db');

function getLandActivities(page, take, landId){
    return db.activity.findMany({
        skip: take * (page - 1),
        take,
        where: {
            landId,
        },
        orderBy:{
            dateAction: 'desc'
        }
    });
}

function getSingleActivity(activityId){
    return db.activity.findUnique({
        where: {
            id: activityId,
        },
    });
}

async function createActivity(category, action, cost, dateAction, landId) {
    try {
        return db.$transaction(async (prisma) => {
            const activity = await prisma.activity.create({
                data: {
                    land: {
                        connect: { id: landId },
                    },
                    category,
                    action,
                    cost,
                    dateAction: new Date(dateAction),
                },
            });

            await prisma.land.update({
                where: {
                    id: landId,
                },
                data: {
                    updatedAt: new Date(),
                    totalCost: {
                        increment: category !== 4 ? cost : 0,
                    },
                    profit: {
                        increment: category === 4 ? cost : -cost,
                    },
                },
            });

            return activity;
        });
    } catch (error) {
        throw error;
    }
}

async function updateActivity(activityId, data) {
    try {
        return db.$transaction(async (prisma) => {
            // Retrieve the existing activity record
            const existingActivity = await prisma.activity.findUnique({
                where: {
                    id: activityId,
                },
            });

            if (!existingActivity) {
                throw new Error('Activity not found');
            }

            // Calculate the difference in cost to handle totalCost and profit updates
            const costDifference = data.cost - existingActivity.cost;

            // Update the activity record
            const updatedActivity = await prisma.activity.update({
                where: {
                    id: activityId,
                },
                data: {
                    ...data,
                    dateAction: data.dateAction  ? new Date(data.dateAction) : existingActivity.dateAction,
                },
            });
            

            // Retrieve the associated land record
            const landId = existingActivity.landId;
            const existingLand = await prisma.land.findUnique({
                where: {
                    id: landId,
                },
            });

            if (!existingLand) {
                throw new Error('Land not found');
            }

            // Update the land record's totalCost and profit fields based on category
            await prisma.land.update({
                where: {
                    id: landId,
                },
                data: {
                    updatedAt: new Date(),
                    totalCost: {
                        increment: data.category !== 4 ? costDifference : 0,
                    },
                    profit: {
                        increment: data.category === 4 ? costDifference : -costDifference,
                    },
                },
            });

            return updatedActivity;
        });
    } catch (error) {
        throw error;
    }
}

async function deleteActivity(activityId, userId){
    const activity = await db.activity.findUnique({
        where:{
            id: activityId,
        },
    });
    const land = await db.land.findUnique({
        where:{
            id:activity.landId,
        },
    });
    if(userId != land.userId){
        throw new Error ('You are not authorized to delete this activity.')
    }
    return db.activity.delete({
        where:{
            id: activityId,
        },
    });
}
module.exports = {
    getLandActivities,
    createActivity,
    getSingleActivity,
    updateActivity,
    deleteActivity,
};