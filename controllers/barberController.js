const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { PrismaClient } =require( '@prisma/client');
const prisma = new PrismaClient();
exports.createStore = catchAsync(async (req,res,next)=>{
    const {servicesId} = req.body;
    const store = await prisma.barberStore.create({
        data:{
            userId : req.user.id,
            barber_service:{
                createMany:{
                    data:servicesId.map(serviceId => ({serviceId,}))
                }
            },
            ...req.body
        }
    });
    res.status(201).json({
        store,
    });
});
exports.getAllBarbers = catchAsync(async (req,res,next)=>{
    const barbers = await  prisma.barberStore.findMany({

    });
    res.status(200).json({
        barbers
    })
});
exports.getAllServices = catchAsync(async (req,res,next)=>{
    const services = await prisma.service.findMany({

    });
    res.status(200).json({
        services
    });
});