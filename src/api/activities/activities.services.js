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
                        increment: category !== "Penjualan" ? cost : 0,
                    },
                    profit: {
                        increment: category === "Penjualan" ? cost : -cost,
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
                throw new Error('Aktivitas tidak ditemukan');
            }

            const {
                category,
                action,
                cost,
                dateAction,
            } = data;

            // Update the activity record
            const updatedActivity = await prisma.activity.update({
                where: {
                    id: activityId,
                },
                data: {
                    category,
                    action,
                    cost,
                    dateAction: new Date(dateAction),
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
                throw new Error('Lahan tidak ditemukan');
            }

            // Update the land record's totalCost and profit fields based on category
            await prisma.land.update({
                where: {
                    id: landId,
                },
                data: {
                    updatedAt: new Date(),
                    totalCost: {
                        increment: existingActivity.category !== "Penjualan" ? -existingActivity.cost : 0,
                    },
                    profit: {
                        increment: existingActivity.category === "Penjualan" ? -existingActivity.cost : existingActivity.cost,
                    },
                },
            });
            await prisma.land.update({
                where: {
                    id: landId,
                },
                data: {
                    updatedAt: new Date(),
                    totalCost: {
                        increment: category !== "Penjualan" ? cost : 0,
                    },
                    profit: {
                        increment: category === "Penjualan" ? cost : -cost,
                    },
                },
            });

            return updatedActivity;
        });
    } catch (error) {
        throw error;
    }
}


async function deleteActivity(activityId, userId) {
    try {
        return db.$transaction(async (prisma) => {
            // Retrieve the existing activity record
            const existingActivity = await prisma.activity.findUnique({
                where: {
                    id: activityId,
                },
            });

            if (!existingActivity) {
                throw new Error('Aktifitas tidak ditemukan');
            }

            // Delete the activity record
            await db.activity.delete({
                where:{
                    id: activityId,
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
                throw new Error('Lahan tidak ditemukan');
            }

            // Update the land record's totalCost and profit fields based on category
            await prisma.land.update({
                where: {
                    id: landId,
                },
                data: {
                    updatedAt: new Date(),
                    totalCost: {
                        increment: existingActivity.category !== "Penjualan" ? -existingActivity.cost : 0,
                    },
                    profit: {
                        increment: existingActivity.category === "Penjualan" ? -existingActivity.cost : existingActivity.cost,
                    },
                },
            });

            return deleteActivity;
        });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getLandActivities,
    createActivity,
    getSingleActivity,
    updateActivity,
    deleteActivity,
};