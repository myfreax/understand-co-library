// @flow
/**
 * Created by Freax on 16-12-12.
 * @Blog http://www.myfreax.com/
 */
function co(generator) {
    let gen = generator();
    //调用generators后返回的是可遍历的迭代器，迭代器中next的方法返回的是一个对象{done:false,value:1}，
    //对象的done属性的是布尔值表示遍历是否结束
    next(gen.next()); //递归遍历generator.next
    function next(result) {
        if (result.done)return null;//如果generator执行完毕，退出遍历
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