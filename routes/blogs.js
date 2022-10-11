

			const { uuid } = require('uuidv4');
			var express = require('express');
			var router = express.Router();
			const {validateUserData} = require('../validation/validate');
			const {db} = require("../mongo");
		
	
		
	
		
		
	router.get('/all-post',async function (req,res,next) {
		try {
			const limit = Number(req.query.limit);
			const skip = Number(req.query.limit) * (Number(req.query.page)- 1);
			const sortField = req.query.sortField;
			const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1;
			const collection = await db().collection('post');
			
				const sortObj = {[sortField]:sortOrder}
				const sortedPost = await collection.find({}).sort(sortObj).limit(limit).skip(skip).toArray();
				res.status(200).json({success:true,allPost:sortedPost});

			

			if (!collection) {
				res.status(500).json({success:false,message:'collection does not exist'})
			}
		} catch (e) {
			console.error("error with all post back end"+e);
		}
	})
			

		router.put('/update-blog/:blogId',async function (req,res,next) {
			console.log('test1')
			const blogId = req.params.blogId;
			try {
				console.log('test1')
				const collection = await db().collection('post');
			
				// const setId = sortedPostArray[sortedPostArray.length - 1];
				console.log("test2")
				
				if (collection!==undefined) {
				const collectionIndex = await collection.findOne({Id:blogId})
					
				
				if (collectionIndex!==null) {
						const updatedCollectionBlogIndex = collectionIndex;
						
						
					const title = req.body.title;
					const text = req.body.text;
					const author = req.body.author;
					const category = req.body.category;
					let starRating = parseInt(req.body.starRating);
					const email = req.body.email;
					const lastModified = new Date().toISOString();
					const makeArray =[];
				makeArray.push(category);
				console.log(makeArray);	
				const blogToUpdate = {
						title:title?title:updatedCollectionBlogIndex.title,
						text:text?text:updatedCollectionBlogIndex.text,
						author:author?author:updatedCollectionBlogIndex.author,
						category:makeArray,
						starRating:starRating?starRating:updatedCollectionBlogIndex.starRating,
						email:email?email:updatedCollectionBlogIndex.email,
						lastModified:lastModified,
						createdAt:updatedCollectionBlogIndex.createdAt?updatedCollectionBlogIndex.createdAt:new Date(),
						
						Id:blogId

					
					} 
					
					console.log(starRating,'blogToupdate');
					const validateBlog = validateUserData(blogToUpdate);


					if(validateBlog.isValid===false){res.status(500).json({success:false,message:validateBlog.message})}

					
					await collection.updateOne({Id:blogId},{$set:blogToUpdate})



					}else{res.status(500).json({success:false,message:'please make sure blog id'+ " " +blogId+" "+ 'matches Blog ID in collection'})}

					

				}



				

			} catch (e) {
				res.status(500).send("Error updating blog." + e)
			}
						});







		
		
		
			router.get('/get-one/:BlogId', async function(req, res, next) {
				try {
					const blogId = Number(req.params.BlogId);
					const collection = await db().collection("post");
					const post = await collection.findOne({Id:blogId});
					res.status(200).json({success:true,blogpost:post})
				} catch (e) {
					res.status(500).json({success:false,message:'post does not exist'})
				}
			});


			router.post('/submit-post',async function (req,res,next)  {
			
				
				
				try {
					const collection = await db().collection('post')
					const sortedPostArray = await collection.find({}).sort({ id: 1 }).toArray();
					const setId = sortedPostArray[sortedPostArray.length - 1];
					const title = req.body.title;
					const text = req.body.text;
					const author = req.body.author;
					let category = req.body.category;
					const makeArray =[];
				makeArray.push(category);
					
				
				
				console.log(makeArray);
					let starRating = Number( req.body.starRating);
					const email = req.body.email;
				
					const Post = {
						email:email,
						title: title,
						text: text,
						author: author,
						category:makeArray,
						starRating:starRating,
						createdAt: new Date(),
						lastModified: new Date(),
					
						Id:uuid()
					
					};
					const verifyPost = validateUserData(Post);
console.log(email)
					
console.log(verifyPost.isValid);
if (verifyPost.isValid===false) {
						res.json({
						message:verifyPost.message,
							success: false,
						  });
						
					}
					  await collection.insertOne(Post);
					  res.status(200).json({success:true,newPost:"Congrats you have sent a new post to the database"+ Post})

				} catch (e) {
					res.status(500).json({success:false,message:"you suck" + e});
				}
			});



			router.delete('/delete-post:blogId') , async function (req,res,next) {
				try {
					const collection = await db().collection('post')
					const postToDelete = req.params.blogId;
					await collection.deleteOne({Id:postToDelete});
					res.status(200).json({success:true,message:'Post has been deleted'})

				} catch (e) {
					res.status(500).json({sucess:false,message:' post is not deleted'+e})
				}
			
			
			
			
			}



			module.exports = router;