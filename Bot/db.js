import mongoose from 'mongoose'

const mongoUrl = 'mongodb+srv://admin:EiTS23K5lOMIKcsa@flavorscatalogbot.5yiic4n.mongodb.net/?retryWrites=true&w=majority&appName=FlavorsCatalogBot'

mongoose.connect(mongoUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error(error))

const userSchema = new mongoose.Schema({
    userId: {type: Number, unique: true}, createdAt: {type: Date, default: Date.now},
})

const User = mongoose.model('User', userSchema)

export {User}