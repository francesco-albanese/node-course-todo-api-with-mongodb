const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')

const data = {
    id: 10
}

let token = jwt.sign(data, '123abc')

let decoded = jwt.verify(token, '123abc')

console.log('decoded', decoded)
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