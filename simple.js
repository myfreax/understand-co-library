// @flow
/**
 * Created by Freax on 16-12-12.
 * @Blog http://www.myfreax.com/
 */
function co(generator) {
    let gen = generator();
    next(gen.next()); //递归遍历generator.next
    function next(result) {
        if (result.done)return null;//如果generator执行完毕，直接解决退出遍历
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