// 检测 data-is-check 属性的值，参数为DOM对象，返回布尔值
export function isCheck (dialogCheck) {
    let attr = dialogCheck;
    if (attr === 'true') {
        // 验证过的返回真值
        return true;
    } else if (attr === 'false') {
        // 未验证返回假值
        return false;
    } else {
        console.error('属性值有误');
        // 有错的情况下返回假值
        return false;
    }
}