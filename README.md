node-freespace-nix
==================

Gets disk usage info: directory size, free space.

*nix os family only

### Usage

```javascript
var freespace = require('freespace-nix');

freespace.df('/tmp', function (err, data) {
    console.log(data);
    /* Sample output
    { 
      filesystem: '/dev/mapper/precise64-root',
      blocks: '82711212',
      used: '676092',
      available: '7180863',
      percent_used: 2,
      mounted_on: '/'
    }
    */
});

freespace.du('/dev', function (err, data) {
    console.log(data);
    /* Sample output
    {
      '.': '11762',
      block: '915',
      disk: '903',
      cpu: '60',
    }
    */
});

```