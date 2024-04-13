const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { PrismaClient } =require( '@prisma/client');
const prisma = new PrismaClient();
exports.buyPackage = catchAsync(async (req,res,next)=>{
    const {packageId} = req.body;
    await prisma.user.update({
        where:{
            id:req.user.id
        },
        data : {
            barberPackage:{
                connect : {
                    id : packageId
                }
            }
        }
    });

});
exports.getAllPackages = catchAsync(async (req,res,next)=>{
    const packages = await prisma.packages.findMany({});
    res.status(200).json({
        packages
    });
});
exports.createPackage = catchAsync(async (req,res,next)=>{
    const package = await prisma.packages.create({
        data:{
            ...req.body
        }
    });
    res.status(201).json({
        package
    });
});