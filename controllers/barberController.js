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
