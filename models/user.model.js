const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        name: String,
        status: {
            type: Boolean,
            default: true
        },
        location: {
            type: { 
                type: String, 
                enum: ['Point'] 
            },
            coordinates: { 
                type: [Number] 
            }
        }
    },
    {
        timestamps: true
    }
);

UserSchema.index({ location: '2dsphere' });

UserSchema.static('findByDistance', function(longitude, latitude, distance, unit = 'km') { 
    const unitValue = unit == 'km' ? 1000 : 1609.3;
    return this.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                query: { status: true },
                maxDistance: distance * unitValue, 
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
});

const User = mongoose.model('User', UserSchema);

module.exports = User;