import mongoose from 'mongoose';    // import your packages at the top of your code.
// Be sure to include in your package.json, the following key:value = "type": "module"

// For Mongoose, you need to 'expose' the Promise functionality to the rest of your project
mongoose.Promise = global.Promise;

// Also for Mongoose, you need to 'expose' the Mongoose Schema type in your code
const Schema = mongoose.Schema;

// create constants to hold necessary information regarding the connection to MongoDB
const mongoDBUrl = "localhost";
const mongoDBPort = "27017";
const mongoDBDatabase = "StudentRegistration";

// Create a Schema object representing trees
const studentSchema = new Schema({
    firstname: { type: "String", required: true },  // "Float" should be a defined Mongoose datatype. UPDATE: FLoat is not a valid Mongoose type, Number is the type for float
    lastname: { type: "String", required: true },
    phone: { type: "String", required: true },
    email: {type: "String", required: true }
});

// set the defined schema as a model for Mongoose to use
const Student = mongoose.model("Student", studentSchema, "students");   // "name of model", schemaObject, "name of Collection in DB"

// For all database (or IO-type functions), they really should be written as asynchronous functions.
// Asynchronous functions will execute and let other Javascript code execute simultaneously.
const connectToDB = async() => {    // the async keyword makes this function an asynchronous function
    // This function will establish the connection to the MongoDB DBMS
    // When working with IO code (in this cade connecting to a DB), try to surround that code with error handling (usually a try/catch block)
    try {
        // Code that could cause an exception (or error) is written here.
        const connectionInfo = `mongodb://${mongoDBUrl}:${mongoDBPort}/${mongoDBDatabase}`;
        const mongoDBConfigObject = {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        };

        await mongoose.connect(connectionInfo, mongoDBConfigObject);    // await makes this part of Javascript wait until this gets resolved. 
                                                                        // You can only use await within async functions
        

    }
    catch (err) {
        // Code to execute if an exception is raised (or thrown).
        // Usually some kind of error recording code.
        console.log(err);
    }
}



const addStudent = async(StudentObj) => { // StudentObj is a JSON object conforming to our defined schema
    try {
        const newStudent = new Student(StudentObj);  // this creates a new Student document based on StudentObj, but doesn't add it just yet.
        let savePromise = newStudent.save();   // You don't need this Promise, unless you want to do something based on the completion of the save method.
        // If you do want ot do something based on the save() Promise, use then()

        return savePromise;
    }
    catch (err) {
        console.log(err);
    }
}
// Write a function that can read all students documents
const getstudents = async() => {
    // use a try/catch because of IO code
    try {
        // the modelObject.find() will retrun a document or documents if no filter is specified.
        await Student.find().exec((err, StudentCollection) => {
            if(err) {
                console.log(err);
            }
            // if we don't have an error, do something with youtr documents
            console.log({StudentCollection });
        });
    }
    catch (err) {
        console.log(err);
    }
}

// async functions can be called in the top-level of your code, but they CANNOT USE await.
// To get around that, create an entry point function that is async and then call your other async functions in that.
const main = async() => {
    // Call your other async functions here.
    // You can also write regular JS code here as well.
    await connectToDB();
    let student ={
        firstname: "Kwizera",   // "Float" should be a defined Mongoose datatype. UPDATE: FLoat is not a valid Mongoose type, Number is the type for float
        lastname: "Johny",
        phone: "8066666666",
        email: "pato@gmail.com"
    }
    await addStudent(student);

    await getstudents();
}

// calling the main entry point.
main();