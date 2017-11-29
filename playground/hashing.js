const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const password = "123abc!"

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt).then(hash => console.log(hash)).catch(e => console.error('error', e))
// })

bcrypt.genSalt(10).then(salt => salt)
.then(salt => bcrypt.hash(password, salt))
.then(hash => console.log(hash))

// const hashedPassword = '$2a$10$XIU3Jo7v7Is5c25zBl2r8enW9fSzGuB.dPMfpKDaWPklV/a7qAT1W'

// bcrypt.compare(password, hashedPassword).then(compared => console.log(compared)).catch(e => console.log(e))

// const data = {
//     id: 10
// }

// let token = jwt.sign(data, '123abc')

// let decoded = jwt.verify(token, '123abc')

// console.log('decoded', decoded)
// jwt.verify

// console.log(SHA256('Testing').toString());

// const data = {
//     id: 4
// }

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some secret').toString()
// }

// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()
// let resultHash = SHA256(JSON.stringify(token.data) + 'some secret').toString()


// if (resultHash === token.hash) {
//     console.log('data was not changed')
// } else {
//     console.log('Data was changed! Don\'t trust')
// }