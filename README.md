## How to use Mailpro in your application

```javascript
MailPro = require('mailpro')
var mailPro = new MailPro({
  privateKey: "key-xxxxxxxxxxxxxxx",
  publicKey: "pubkey-xxxxxxxxxxxxx",
  domain: "domain.com",
  secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
});
// You can start using any of the methods below
```

### Methods available for use

**Get a list of subscribers from a mailing list**

```javascript
mailPro.getSubscribers('mailing-list@domain.com').then(result => {});
```

**Create a subscriber for a selected mailing list**

```javascript
const user = {
  address: 'example@example.com',
  name: 'Brandy',
  vars: {} /* Variables you want to save */
};
const list = 'mailing-list@domain.com';

mailPro.createSubscriber(list, user).then(result => {});
```

**Update a selected subscriber from a selected mailing list**

```javascript
const user = {
  address: 'example@example.com',
  name: 'Brandy',
  vars: {} /* Variables you want to save */
};
const list = 'mailing-list@domain.com';

mailPro.updateSubscriber(list, user).then(result => {});
```

**Validate an email address for validity**

```javascript
const email = 'example@example.com';
mailPro.validateEmail(email).then(valid => {});
```

**Encrypt and Decrypt Objects**

```javascript
const user = {
  username: 'brandy19',
  age: 23,
  sex: 'female',
  balance: 3339.03
}
const Encrypted = mailPro.encrypt(user);
```

```javascript
const Encrypted = '36d435ec6268244a209c1d3b5b8d12c7838f604fc907519e8e75583f1c12902f62e5da4905bea381326b893fc750c9ca913bd6d8cd9cdb13ba541329399100989ac22dfa10ab2cf9784ee8183c55fa96'
const Decrypted = mailPro.decrypt(user);
// Results -> { username: 'brandy19', age: 23, sex: 'female', balance: 3339.03 }
```