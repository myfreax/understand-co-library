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
                    return reject(e);// 捕获后由交给promise处理返回外部处理
                }
                next(result)
            }, err => {
                let result;
                try {
                    result = gen.throw(err); //传入到生成器由内部捕获错误
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