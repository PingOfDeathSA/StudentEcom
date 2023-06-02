//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;
mongoose.set('strictQuery', true);




const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('trust proxy', 1);


app.use(session({
  secret: 'THeTerminatorIsHere',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collectionName: 'sessions',
    ttl: 60 * 60 // 1 hour
  })
}));


app.use(passport.initialize());
app.use(passport.session());
mongoose.connect('mongodb+srv://PingOfDeathSA:Ronald438@cluster0.kqlfkdc.mongodb.net/OliviaDB');



const userschema = new mongoose.Schema({
  email: String,
  password: String,
  companyname: String,
  Company_image: String,
  ContactDetails: String
});


userschema.plugin(passportLocalMongoose);


const UserModel = mongoose.model("User", userschema);

passport.use(UserModel.createStrategy());
passport.use(new LocalStrategy({ username: 'email' }, UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());


const UserSave = new UserModel({
  email: "Student@gmail.com",
  password: "testing@443547",
  StudentNumber: '20232234',

});
// const ChatsSave = new ChatsModel({
//   email: "Student@gmail.com",
//   password: "testing@443547",
//   StudentNumber: '20232234',
//   Date: Date.now(),

// });

const ChatsSchema = mongoose.Schema({
  Buyer: {
    type: String || Number,
  },
  ProductID: {
    type: String || Number,
  },
  Message: {
    type: String || Number,
  },
  Reply: {
    type: String || Number,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now
  }
});
const ChatsModel = mongoose.model("Chats_collec", ChatsSchema);


const ProductSchema = mongoose.Schema({
  Contacts: {
    type: String || Number,
  },
  Product_Name: {
    type: String || Number,
  },
  imageProductMain: {
    type: String || Number,
  },
  imageProduct1: {
    type: String || Number,
  },
  imageProduct2: {
    type: String || Number,
  },
  imageProduct3: {
    type: String || Number,
  },
  ItemCategory: {
    type: String || Number,
  },
  price: {
    type: String || Number,
  },
  details: {
    type: String || Number,
  },
  PostedBy: {
    type: String || Number,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now
  }
});
const Productmodel = mongoose.model("prodcut_collec", ProductSchema);

const ProductSave = new Productmodel({
  Product_Name: "Adidas Hat",
  imageProductMain: "https://thefoschini.vtexassets.com/arquivos/ids/45184783-1200-1200?v=638157036716730000&width=1200&height=1200&aspect=true",
  imageProduct1: "https://thefoschini.vtexassets.com/arquivos/ids/45184793-1200-1200?v=638157036727930000&width=1200&height=1200&aspect=true",
  imageProduct2: "https://thefoschini.vtexassets.com/arquivos/ids/45184809-1200-1200?v=638157036736970000&width=1200&height=1200&aspect=true",
  imageProduct3: "https://thefoschini.vtexassets.com/arquivos/ids/45184783-1200-1200?v=638157036716730000&width=1200&height=1200&aspect=true",
  Contacts: '0798434567',
  price: "269,00",
  ItemCategory: "Clothing",
  details: "Used like new",
  Date: Date.now(),
});
// ProductSave.save(function (err) {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log("Product added");
//           }
// });


app.post('/Charts.html', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user.username;
    const message = req.body.chatInput;
    const ProductID = req.body.itemId;
    const Reply = req.body.reply;

    // Log the message and ID to the console
    console.log('Message:', message);
    console.log('ID:', ProductID);
    console.log('ID:', user);

    ChatsModel.findOneAndUpdate(
      { Buyer: user, ProductID: ProductID },
      { Reply: Reply, Date: Date.now() },
      { new: true, upsert: true }
    )
      .then(updatedChat => {
        console.log(updatedChat);

        res.redirect("/");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(`
            <div style="background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
              <strong>Error:</strong> ${err}
            </div>
          `);
      });
  } else {
    res.redirect('/');
  }
});





app.post("/AddnewItem", function (req, res) {

  if (req.isAuthenticated()) {
    const user = req.user.username;

    // Retrieve form data
    const productName = req.body.ProductName;
    const contactNumber = req.body.Contactnumber;
    const price = req.body.Price;
    const category = req.body.category;
    const imageLink1 = req.body.Imagelink1;
    const imageLink2 = req.body.Imagelink2;
    const imageLink3 = req.body.Imagelink3;
    const imageLink4 = req.body.Imagelink4;
    const details = req.body.Details;




    // // Validate the form input data before saving
    // if (!category || !price || !contactNumber || !productName) {
    //     return res.status(400).send("Please fill in all required fields");
    // }
    console.log(user);
    console.log(productName);
    console.log(contactNumber);
    console.log(price);
    console.log(category);
    console.log(imageLink1);
    console.log(imageLink2);
    console.log(imageLink3);
    console.log(imageLink4);
    console.log(details);


    const PayrollSave = new Productmodel(
      {

        Product_Name: productName,
        imageProductMain: imageLink1,
        imageProduct1: imageLink2,
        imageProduct2: imageLink3,
        imageProduct3: imageLink4,
        Contacts: contactNumber,
        price: price,
        ItemCategory: category,
        details: details,
        Date: Date.now(),
        PostedBy: user

      });
    PayrollSave.save()
      .then(() => res.redirect("/"))
      .catch(err => {
        console.error(err);
        res.status(500).send(`
          <div style="background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
            <strong>Error:</strong> ${err}
          </div>
        `);
      });

  } else {
    res.redirect('/')
  }



});








// Starting Sever
app.listen(5000, function () {
  console.log("Server started on port 5000");
});

app.post('/search', (req, res) => {
  const searchQuery = req.body.searchQueryName.toLowerCase();

  console.log("Search Query: ", searchQuery);
  Productmodel.find(
    {
      $or: [
        { Product_Name: { $regex: searchQuery, $options: "i" } },
        { price: { $regex: searchQuery, $options: "i" } },
        { details: { $regex: searchQuery, $options: "i" } }
      ]
    },
    function (err, Productresults) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred while searching.");
      } else {
        // console.log(EmployeeDetails);
        res.render("Market", { listTitle: "Today", Learn: Productresults });
      }
    }
  );
});
app.post('/search2', (req, res) => {
  const searchQuery = req.body.searchQueryName.toLowerCase();

  console.log("Search Query: ", searchQuery);
  Productmodel.find(
    {
      $or: [
        { Product_Name: { $regex: searchQuery, $options: "i" } },
        { price: { $regex: searchQuery, $options: "i" } },
        { details: { $regex: searchQuery, $options: "i" } }
      ]
    },
    function (err, Productresults) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred while searching.");
      } else {
        // console.log(EmployeeDetails);
        res.render("MyItems", { listTitle: "Today", Learn: Productresults });
      }
    }
  );
});

app.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


app.get("/Login.html", function (req, res) {
  if (req.isAuthenticated()) {

    Productmodel.find({}, function (err, Product) {
      if (err) {
        console.log(err);
      } else {
        const user = req.user.username;

        UserModel.find({ email: user }, function (err, users) {
          if (err) {
            console.log(err);
          } else {
            //  console.log("Number of users:", users.length);
            //  console.log("Logged-in user email:", user);
            res.render("AddnewItem", {
              listTitle: "Today",
              Learn: Product,
              userEmail: user,
              userEmailHTML: user.username,
              ComapanyNmae: user.companyname,
            });
          }
        });
      }
    });

  } else {
    res.redirect("/")
  }
});

app.post('/delete-item', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user.username;
    const itemId = req.body.itemId;

    Productmodel.findOneAndDelete({ _id: itemId, PostedBy: user }, (err, deletedItem) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error occurred during deletion');
      } else if (!deletedItem) {
        res.status(404).send('Item not found or you do not have permission to delete it');
      } else {
        res.send('Item deleted successfully');
      }
    });
  } else {
    res.redirect('/');
  }
});

app.get("/MyItems.html", function (req, res) {
  if (req.isAuthenticated()) {
    const user = req.user.username;

    Productmodel.find({ PostedBy: user }, function (err, EmployeeDetails) {
      if (err) {
        console.log(err);
      } else {
        const user = req.user;

        UserModel.find({ PostedBy: user }, function (err, users) {
          if (err) {
            console.log(err);
          } else {
            // console.log("Number of users:", users.length);
            // console.log("Logged-in user email:", user);
            res.render("MyItems", {
              listTitle: "Today",
              Learn: EmployeeDetails,
              userEmail: user,
              userEmailHTML: user.username,
              ComapanyNmae: user.companyname,
            });
          }
        });
      }
    });

  } else {
    res.redirect("/")
  }
});




app.get('/Inbox.html', (req, res) => {

  if (req.isAuthenticated()) {
    const user = req.user.username;

    UserModel.find(
      { username: user },
      function (err, User) {
        if (err) {
          console.log(err);
          res.status(500).send("An error occurred while searching.");
        } else {
          Productmodel.find(


            { PostedBy: user },
            function (err, UserPosted) {
              if (err) {
                console.log(err);
                res.status(500).send("An error occurred while searching.");
              } else {
                // console.log("UsersPosts ", UserPosted);


                function getIdsFromUserPosted(UserPosted) {
                  return UserPosted.map(item => item._id.toString());
                }
                var ids = getIdsFromUserPosted(UserPosted);
                console.log(ids);
                ChatsModel.find({ ProductID: { $in: ids } }, function (err, FoundChats) {
                  if (err) {
                    console.log(err);
                    res.status(500).send("An error occurred while searching.");
                  } else {

                    Productmodel.find({ _id: { $in: ids } }, function (err, FoundProducts) {
                      if (err) {
                        console.log(err);
                        res.status(500).send("An error occurred while searching.");
                      } else {


                        const finalList = FoundChats.map(chat => {
                          const foundProduct = FoundProducts.find(product => product._id.toString() === chat.ProductID.toString());
                          if (foundProduct) {
                            return {
                              ...chat.toObject(),
                              Product_Name: foundProduct.Product_Name,
                              imageProductMain: foundProduct.imageProductMain
                            };
                          } else {
                            return chat.toObject();
                          }
                        });
                        
                        console.log(finalList);
                        
                        



                        // console.log("Messages", FoundChats);
                        res.render("inbox", {
                          Testing: 'testing',
                          Learn: finalList,
                          // Products: FoundProducts,
                          user: user,
                        });
                        // Process the FoundChats as needed
                        // res.render("Market", { Testing: 'testing', Learn: ProductDetails });
                      }
                    });


                  }
                });

              }
            }
          );



          console.log("Messages ", User);

        }
      }
    );


  } else {
    res.redirect("/")
  }

});





app.get('/outbox.html', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user.username;

    ChatsModel.find({ PostedBy: user }, function (err, FoundChats) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred while searching.");
      } else {
        const productIds = FoundChats.map(chat => chat.ProductID);

        Productmodel.find({ _id: { $in: productIds } }, function (err, FoundProducts) {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred while searching.");
          } else {
            const finalList = FoundChats.map(chat => {
              const foundProduct = FoundProducts.find(product => product._id.toString() === chat.ProductID.toString());
              if (foundProduct) {
                return {
                  ...chat.toObject(),
                  Product_Name: foundProduct.Product_Name,
                  imageProductMain: foundProduct.imageProductMain
                };
              } else {
                return chat.toObject();
              }
            });

            console.log(finalList);

            res.render("outbox", {
              Testing: 'testing',
              Learn: finalList,
              user: user,
            });
          }
        });
      }
    });
  } else {
    res.redirect("/");
  }
});




// app.get("/",function(req, res){
//   res.render("Market");
// });

app.get('/', (req, res) => {
  Productmodel.find(
    {},
    function (err, ProductDetails) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred while searching.");
      } else {
        console.log("Employee number exits ", ProductDetails);

        res.render("Market", {
          Testing: 'testing',
          Learn: ProductDetails,
        });
      }
    }
  );
});





app.post("/BuyerLogin.html", function (req, res) {

  if (req.isAuthenticated()) {
    const user = req.user.username;

    Productmodel.find(
      {},
      function (err, ProductDetails) {
        if (err) {
          console.log(err);
          res.status(500).send("An error occurred while searching.");
        } else {
          console.log("Employee number exits ", ProductDetails);

          res.render("Buyermarket", {
            Testing: 'testing',
            Learn: ProductDetails,
          });
        }
      }
    );

  } else {
    res.redirect("/")
  }


});


app.post("/Login.html", function (req, res) {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
  })
  req.logIn(user, function (err) {
    if (err) {
      console.log(err)
    } else {
      passport.authenticate("local")(req, res, function () {

        Productmodel.find({}, function (err, EmployeeDetails) {
          if (err) {
            console.log(err);
          } else {
            const user = req.user;

            UserModel.find({ email: user.email }, function (err, users) {
              if (err) {
                console.log(err);
              } else {
                // console.log("Number of users:", users.length);
                // console.log("Logged-in user email:", user);
                res.render("AddnewItem", {
                  listTitle: "Today",
                  Learn: EmployeeDetails,
                  userEmail: user,
                  userEmailHTML: user.username,
                  ComapanyNmae: user.companyname,
                });
              }
            });
          }
        });


      })
    }

  })

});






app.get("/UseRegister.html", function (req, res) {
  res.render("UserRegister");
});
app.post("/UseRegister.html", function (req, res) {

  UserModel.register({ username: req.body.username, StudentNumber: req.body.StudentNumber, }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/UseRegister.html");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      })
    }
  });
});








app.get("/register.html", function (req, res) {
  res.render("registerpage");
});
app.post("/register.html", function (req, res) {

  UserModel.register({ username: req.body.username, StudentNumber: req.body.StudentNumber, }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register.html");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      })
    }
  });
});

