const User = require('../models/user.model');

exports.nearByUsersExample1 = async (req, res) => {
    const latitude = 28.626137;
    const longitude = 79.821602;
    const distance = 1;
    const unitValue = 1000;

    const users = await User.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                query: {
                    status: true
                },
                maxDistance: distance * unitValue, // distance in meters
                distanceField: 'distance',
                distanceMultiplier: 1 / unitValue
            }
        },
        {
            $project: {
                _id: 1,
                distance: 1
            }
        },
        {
            $sort: {
                distance: 1
            }
        },
        { $limit: 5 }
    ]);
    return res.json(users)
}

exports.nearByUsersExample2 = async (req, res) => {
    const latitude = 28.626137;
    const longitude = 79.821602;
    const distance = 1;

    const users = await User.findByDistance(longitude, latitude, distance);
    return res.json(users)
}

exports.nearByUsersExample3 = async (req, res) => {
    const latitude = 28.626137;
    const longitude = 79.821602;
    const distance = 1;
    const unitValue = 1000;

    // $near sorts documents by distance
    const users = await User.find({
        location: {
            $near: {
                $maxDistance: distance * unitValue, // distance in meters
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
            }
        }
    })
    .select('_id')
    return res.json(users)
}

exports.dummyData = async (req, res) => {
    const users = await User.insertMany([
        {
            name: 'User 1',
            location: {
                type: 'Point',
                coordinates: [79.821602, 28.626137]
            }
        },
        {
            name: 'User 2',
            location: {
                type: 'Point',
                coordinates: [79.821091, 28.625484]
            }
        },
        {
            name: 'User 3',
            location: {
                type: 'Point',
                coordinates: [79.817924, 28.625294]
            }
        },
        {
            name: 'User 4',
            location: {
                type: 'Point',
                coordinates: [79.814636, 28.625181]
            }
        },
        {
            name: 'User 5',
            location: {
                type: 'Point',
                coordinates: [79.810135, 28.625044]
            }
        },
        {
            name: 'User 6',
            location: {
                type: 'Point',
                coordinates: [79.808296, 28.625019]
            }
        }
    ]);
    return res.json(users);
} 