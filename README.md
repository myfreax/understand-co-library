# 理解Co库的源码

> Co流程流程控制器源码与理解,index.js包含理解和注释

## 简单版本的Co库

> 这个版本是重点是理解generator工作原理

```js
// @flow
/**
 * Created by Freax on 16-12-12.
 * @Blog http://www.myfreax.com/
 */
function co(generator) {
    let gen = generator();
    next(gen.next()); //递归遍历generator.next
    function next(result) {
        if (result.done)return null;
          //调用generators后返回的是可遍历的迭代器，迭代器中next的方法返回的是一个对象{done:false,value:1}，
          //对象的done属性的是布尔值表示遍历是否结束
        let res = gen.next(result.value);
        next(res);
    }
}

co(function *gen() {
    let a = yield 1;
    console.info(a, 'a');
    let b = yield 2;
    console.info(b, 'b');
    let c = yield 3;
    console.info(c, 'c');
});
```



## generator+promise Co库的简版
> 理解generator+promise如何工作


```js
// @flow
/**
 * Created by Freax on 16-12-12.
 * @Blog http://www.myfreax.com/
 */

function isPromise(obj) {
    return typeof obj === 'object' && 'function' == typeof obj.then;
}

function co(generator) {
    return new Promise((resolve,reject)=>{
        let gen = generator();
        next(gen.next());
        function next(result) {
            if (result.done)return resolve(result.value);
              //调用generators后返回的是可遍历的迭代器，迭代器中next的方法返回的是一个对象{done:false,value:1}，
              //对象的done属性的是布尔值表示遍历是否结束
            //判断是否是Promise，如果是promise则执行promise再进入next递归遍历generator.next
            if (isPromise(result.value))return result.value.then(res => {
                let result;
                try {
                    result = gen.next(res); 
                }catch (e){
                    return reject(e);// generator运行时的错误，捕获后由交给promise处理返回外部处理
                }
                next(result)
            }, err => {
                let result;
                try {
                    //Generator函数返回的遍历器对象，都有一个throw方法，
                    //可以在函数体外抛出错误，然后在Generator函数体内捕获。
                    result = gen.throw(err); //yield返回promise进入reject后的错误，抛出generator的错误
                }catch (e){
                    return reject(e); // 捕获后由交给promise处理返回外部处理
                }
                next(result)
            });
            let res = gen.next(result.value);
            next(res);
        }
    });

}

co(function *gen() {
    let a = yield Promise.resolve(1);
    console.info(a, 'a');
    let b = yield 2;
    console.info(b, 'b');
    let c = yield 3;
    console.info(c, 'c');

}).catch((err)=>{
    console.info(err);
});
```