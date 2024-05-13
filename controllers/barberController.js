const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { PrismaClient } =require( '@prisma/client');
const prisma = new PrismaClient();

exports.changeBookingStatus = catchAsync(async (req,res,next)=>{
    const {id} = req.params;
    const {status} = req.body;
    const booking = await prisma.booking.update({
        where:{
            id:+id,

        },
        data:{
            status:status
        }
    });
    res.status(200).json({
        booking,
    });
});
exports.getStoreById = catchAsync(async (req,res,next)=>{
    const {id} = req.params;
    const store = await prisma.barberStore.findUnique({
        where:{
            id:+id
        },
        include:{
            barber_service:true,
            user:true,
            booking:{
                include:{
                    user:true,
                    booking_services:true
                }
            }
        }
    });
    res.status(200).json({
        store
    });
});
exports.getMyStores = catchAsync(async (req,res,next)=>{

    const stores = await prisma.barberStore.findMany({
        where:{
            userId:+req.user.id,
            
        },
        include:{
            barber_service:true,
            booking:{
                where:{
                    status:{
                        not:"Finished"
                    }
                },
                include:{
                    user:true,
                    booking_services:{
                        include:{
                           service:true
                        }
                    
                    },

                },
                orderBy:{
                    Date:"asc"
                }
            }
            
            
        }
    });
    console.log(stores);
    res.status(200).json({
        stores
    });
});
exports.getActiveStoreBookings = catchAsync(async (req,res,next)=>{
    const {id} = req.params;
    const bookings = await prisma.booking.findMany({
        where:{
            barberStoreId:+id,
            status:{
                notIn:["Finished","Canceled"]
            }
        },
        include:{
            user:true,
            booking_services:{
                include:{
                    service:true
                }
            }
        }
    });
    res.status(200).json({
        bookings
    });
});
exports.getStoreBookings = catchAsync(async (req,res,next)=>{
    const {id} = req.params;
    const bookings = await prisma.booking.findMany({
        where:{
            barberStoreId:+id,
            
        },
        include:{
            user:true
        }
    });
    res.status(200).json({
        bookings
    });
});
exports.createServices = catchAsync(async(req,res,next)=>{
    const {services} = req.body; // [ {name : , price : },{name : , price : }]
    console.log(req.body);
    const servicesId = [];
    await services.forEach(async service => {
        const serviceD  = await prisma.barber_service.create({
            data:{
                price:+service.price,
                serviceName:service.name
            }
        });
        servicesId.push(serviceD.id);
    });
    req.serviceId = servicesId;
    next();
});
exports.createStore = catchAsync(async (req,res,next)=>{
    const servicesId = req.serviceId;
    req.body.services = undefined;
    const store = await prisma.barberStore.create({
        data:{
            userId : req.user.id,
            ...req.body
        }
    });
    await servicesId.forEach(async id => {
        await prisma.barber_service.update({
            where:{
                id:+id,

            },
            data:{
                barberStoreId : store.id
            }
        });
    });
    res.status(201).json({
        store,
    });
});
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c;
  }
  
  // Helper function to convert degrees to radians
  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
exports.getAllBarbers = catchAsync(async (req,res,next)=>{
    let {type,nearest,farthest,lat,lng,services} = req.query;
    services = services.split(",");
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const whereClause = {
        barberType: type || "Male"
    };

    if (services.length > 0) {
        whereClause.barber_service = {
            every: {
                serviceName: {
                    in: services
                }
            }
        };
    }
    const barbers = await  prisma.barberStore.findMany({
        where: whereClause,
        include:{
            barber_service:true
        },
        orderBy:{
            booking:{
                _count:"desc"
            }
        }
    });
    let barbersInRange;
    if (nearest&&farthest){
        const nearestDistance = parseFloat(nearest);
        const farthestDistance = parseFloat(farthest);
        barbersInRange = barbers.filter(barber => {
            const distance = haversineDistance(userLat, userLng, barber.lat, barber.lng);
            return distance >= nearestDistance && distance <= farthestDistance;
        });
    }else {
        barbersInRange=barbers;
    }
    
    res.status(200).json({
        barbersInRange
    })
});
exports.getAllServices = catchAsync(async (req,res,next)=>{
    const services = await prisma.barber_service.findMany({

    });
    res.status(200).json({
        services
    });
});
exports.getAllbooked = catchAsync(async (req,res,next)=>{
    const {id} = req.params;
    const bookings = await prisma.booking.findMany({
        where:{
            barberStoreId:+id,
        },
        include:{
            user:{
                select:{
                    name:true,
                    gender:true,
                    photo:true,
                    phoneNumber:true,
                    email:true,
                }
            }
        }
    });
    res.status(200).json({
        bookings,
    });
});
