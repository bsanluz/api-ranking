import * as mongoose from 'mongoose';


export const categorySchema = new mongoose.Schema({
    category: {type: String, unique: true},
    description: {type: String},
    events:[
        {
        name: { type: String },
        operation: { type: String },
        value: { type: Number }
        }
    ],
    players:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }] 

}, {timestamps: true , collection: 'categories'})