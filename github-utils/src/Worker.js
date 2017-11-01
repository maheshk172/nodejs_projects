const testFunction = () => {
    "use strict";
    console.log('Test');
};

const testAsyncFunction = () => {
    "use strict";
   return new Promise((Resolve, Reject) => {
      setTimeout(()=> {
          Resolve();
      }, 5000);
   });
};

testFunction();
testAsyncFunction().then((data) => {
    "use strict";
    console.log('returned from async');
}).catch((err) => {
    "use strict";
    console.log('returned from async err');
});
