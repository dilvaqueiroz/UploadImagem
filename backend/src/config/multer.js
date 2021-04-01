const multer = require ('multer');
const path = require ('path');
const crypto = require('crypto');
const aws = require("aws-sdk");
const multerS3 = require('multer-s3');


 /**
  * colocar no .env essas chaves geradas pelo S3
  * AWS_ACCESS_KEY_ID= chave
  * AWS_SECRET_ACCESS_KEY= chave
  * AWS_DEFAULT_REGION=us-east-1
  */
   
 const storageTypes = {
     local:multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null,path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err,hash) => {
                if(err) cb(err);

                file.key = `${hash.toString('hex')}-${file.originalname}`;

                cb(null,file.key);
            });
        }
    }),

    // Se estiver usando apenas servidor local deixe comentado o techo abaixo, Se usando S3 retire o comentário
    /*s3:multerS3({
        s3: new aws.s3(),
        bucket:'nomeDoBucket',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err,hash) => {
                if(err) cb(err);

                const fileName = `${hash.toString('hex')}-${file.originalname}`;

                cb(null,fileName);
            });
        },
    }),*/
 };



module.exports = {
    dest:path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE], // ["s3"] ou [local] sempre que alterar qualquer variavel no arquivo.env reiniciar a aplicação pra que consiga ler o .env
    limits:{
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error("Invalid file type."));
        }
    },
};