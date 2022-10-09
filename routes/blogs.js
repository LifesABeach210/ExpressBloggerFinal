

			const { uuid } = require('uuidv4');
			var express = require('express');
			var router = express.Router();
			const {validateData} = require('../validation/validate');
			const {postdb} = require("../mongo");

		
		router.get('/all-post'),async (req,res,next) => {
			try {
				const limit = Number(req.query.limit);
				const skip = Number(req.query.limit) * (Number(req.query.page)- 1);
				const sortField = req.query.sortField;
				const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1;
				const collection = await postdb().collection('post');
				
					const sortObj = {[sortField]:sortOrder}
					const sortedPost = await collection.find({}).sort(sortObj).limit(limit).skip(skip).toArray();
					res.status(200).json({success:true,allPost:sortedPost});

				

				if (!collection) {
					res.status(500).json({success:false,message:'collection does not exist'})
				}
			} catch (e) {
				console.error("error with all post back end"+e);
			}
	
		
		};
		

		router.put('/update-blog/:blogId'),async (req,res,next) => {
			const blogId = Number(req.params.blogId);
			try {
				
				const collection = await postdb().collection('post').toArray();
				const sortedPostArray = await collection.find({}).sort({ id: 1 }).toArray();
				const setId = sortedPostArray[sortedPostArray.length - 1];
				
				
				if (collection) {
				const collectionIndex =	collection.findOne({Id:blogId})
					if (collectionIndex===true) {
						const updatedCollectionBlogIndex = collectionIndex;
						
						
					const title = req.body.title;
					const text = req.body.text;
					const author = req.body.author;
					const category = req.body.category;
					const starRating = req.body.starRating;
					const email = req.body.email;
					const lastModified = new Date().toISOString();
				
					const blogToUpdate = {
						title:title?title:updatedCollectionBlogIndex.title,
						text:text?text:updatedCollectionBlogIndex.text,
						author:author?author:updatedCollectionBlogIndex.author,
						category:category?category:updatedCollectionBlogIndex.category,
						starRating:starRating?starRating:1,
						email:email,
						lastModified:lastModified,
						createdAt:updatedCollectionBlogIndex.createdAt?updatedCollectionBlogIndex.createdAt:new Date(),
						uuid:uuid(),
						Id:Number(setId.Id + 1)?Number(setId.Id + 1):1,

					
					} 
					const validateBlog = validateData(blogToUpdate)


					if(validateBlog.isValid===false){res.status(500).json({success:false,message:validateBlog.message})}

					
					await collection.updateOne({Id:blogId},{$set:blogToUpdate})



					}else{res.status(500).json({success:false,message:'please make sure blog id'+ " " +blogId+" "+ 'matches Blog ID in collection'})}

					

				}



				

			} catch (e) {
				res.status(500).send("Error updating blog." + e)
			}







		}
		
		
			router.get('/get-one/:BlogId', async function(req, res, next) {
				try {
					const blogId = Number(req.params.BlogId);
					const collection = await postdb().collection("post");
					const post = await collection.findOne({id:blogId});
					res.status(200).json({success:true,blogpost:post})
				} catch (e) {
					res.status(500).json({success:false,message:'post does not exist'})
				}
			});


			router.post('/submit-post'),async (req,res,next) => {
				const verifyPost = validateData(req.body);

				if (!verifyPost) {
					res.status(400).json({
						message:
						  "To submit a blog you must include Title, Author, Category, and Text.",
						success: false,
					  });
					  return;
				}
				
				
				try {
					const collection = await postdb().collection('post')
					const sortedPostArray = await collection.find({}).sort({ id: 1 }).toArray();
					const setId = sortedPostArray[sortedPostArray.length - 1];
					const title = req.body.title;
					const text = req.body.text;
					const author = req.body.author;
					const category = req.body.category;
					const starRating = req.body.starRating;
					const email = req.body.email;
					
					const Post = {
						email:email,
						title: title,
						text: text,
						author: author,
						category:category,
						starRating:starRating,
						createdAt: new Date(),
						lastModified: new Date(),
						Id: Number(setId.Id + 1),
						uuid:uuid()
					
					};

					  await collection.insertOne(Post);
					  res.status(200).json({success:true,newPost:"Congrats you have sent a new post to the database"+Post})

				} catch (e) {
					res.status(500).json({success:false,message:"you suck" + e});
				}
			}







			module.exports = router;