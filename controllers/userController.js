const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { PrismaClient } =require( '@prisma/client');
const prisma = new PrismaClient();
exports.getMyBooking = catchAsync(async(req,res,next)=>{
    const booking = await prisma.booking.findMany({
        where:{
            userId:req.user.id,
            status:{
                not:"Finished"
            },

        },
        include:{
            booking_services:true,
            barberStore:true
            
        },
        orderBy:{
            Date:"desc"
        }
    });
    let lastBooking;
    if (booking.length>0){
        lastBooking = booking[0];
    }else {
        lastBooking = null
    }
    res.status(200).json({
        booking : lastBooking,
    });
});
exports.getBookingById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let booking = await prisma.booking.findUnique({
        where: {
            id: +id,
        },
        include: {
            booking_services: true,
            barberStore: true
        }
    });

    // Check if booking is retrieved successfully
    if (!booking) {
        return next(new Error('No booking found with that ID'));
    }

    // Convert booking.date to a Date object if it's not already
    const bookingDate = new Date(booking.date);

    // Calculate the current time plus 30 minutes
    const now = new Date();
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000);

    // Check if booking date is within the next 30 minutes
    if (bookingDate > now && bookingDate <= thirtyMinutesLater) {
        booking = await prisma.booking.update({
            data:{
                status:"Waiting"
            },
            where:{
                id:+id
            }
        });
    }else  if (bookingDate > now) {
        booking = await prisma.booking.update({
            data:{
                status:"Booked"
            },
            where:{
                id:+id
            }
        });
    }else {
        booking = await prisma.booking.update({
            data:{
                status:"InProcess"
            },
            where:{
                id:+id
            }
        });
    }

    res.status(200).json({
        booking
    });
});
