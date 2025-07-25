// const express=require('express');
// const bodyParser=require('body-parser');
// const mongoose=require('mongoose');
// const Feedback=require('./models/Feedback');

// const app=express();
// const port=3000;

// mongoose.connect('mongodb://localhost:27017/feedback-collection-system',{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// })
// .then(()=>console.log('mongodb connected'))
// .catch((err)=>console.log('mongodb connection error',err));

// app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static('views'));

// app.get('/',(req,res)=>{
//     res.sendFile(__dirname+'/views/index.html');
// });

// app.post('/submit-feedback',async(req,res)=>{
//     const feedback=new Feedback({
//         name:req.body.name,
//         contactNumber:req.body.contactNumber,
//         email:req.body.email,
//         feedback:req.body.feedback
//     });
//     try{
//         await feedback.save();
//         console.log('Feedback saved successfully');
//         res.send(
//             `
//             <html>
//             <head>  
//             <style>
//             body{
//             background-size: cover;
//             background-repeat: no-repeat;
//             background-attachment: fixed;
//             margin:0;
//             font-family: Arial, Helvetica, sans-serif;
//             background-image: url("https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
//             }
//             div{
//             background: rgba(255,255,255,0.5);
//             padding: 30px;
//             max-width: 600px;
//             margin:100px auto;
//             border-radius: 10px;
//             }
//             </style>
//             <title>Feedback Submitted</title>
//             </head>
//             <div>
//             <h1>
//             Thank you
//             </h1>
//             <p>
//             Your feedback has been successfully submitted.</p>
//             <a href="/"> Go Back to Form</a>
//             </div>
//             </body>
//             <html>
//             `
//         );
//     } catch(err){
//         console.log(`Error Saving feedback:`,err);
//         res.status(500).send(`There was an error in submitting your feedback`);
//     }
// });

// app.listen(port,()=>{
//    console.log(`server is running on http://localhost:${port}`);     
// });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Feedback = require('./models/Feedback');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/feedback-collection-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// Serve form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Handle feedback submission
app.post('/submit-feedback', async (req, res) => {
    const feedback = new Feedback({
        name: req.body.name,
        contactNumber: req.body.contactNumber,
        email: req.body.email,
        feedback: req.body.feedback
    });

    try {
        await feedback.save();
        console.log('\n✅ Feedback saved successfully');

        // Fetch and print all feedbacks in terminal
        const allFeedbacks = await Feedback.find().sort({ _id: -1 });
        console.log('\n----- 📋 All Feedbacks -----');
        console.table(allFeedbacks.map(f => ({
            Name: f.name,
            Contact: f.contactNumber,
            Email: f.email,
            Feedback: f.feedback
        })));
        console.log('----------------------------\n');

        // Simple success message in browser
       res.send(
            `
            <html>
            <head>  
            <style>
            body{
            background-size: cover;
            background-repeat: no-repeat;
            background-attachment: fixed;
            margin:0;
            font-family: Arial, Helvetica, sans-serif;
            background-image: url("https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
            }
            div{
            background: rgba(255,255,255,0.5);
            padding: 30px;
            max-width: 600px;
            margin:100px auto;
            border-radius: 10px;
            }
            </style>
            <title>Feedback Submitted</title>
            </head>
            <div>
            <h1>
            Thank you
            </h1>
            <p>
            Your feedback has been successfully submitted.</p>
            <a href="/"> Go Back to Form</a>
            </div>
            </body>
            <html>
            `
        );
    } catch (err) {
        console.log('❌ Error saving feedback:', err);
        res.status(500).send('Error saving feedback');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});

