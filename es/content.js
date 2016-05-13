// 用 JS 代码来生成 HTML 的内容，参数是商品对象，用户信息对象， 返回HTML字符串
export function generateGood (message, owner) {
    let sexHTML;
    function tagsToHTML (tags) {
        let response = '';
        tags.forEach( function(element, index) {
            response += `<label class="ui-label">${element}</label>`;
        });
        return response;
    }
    if (owner.sex == 1) {
        sexHTML = '<i class="ui-icon-male"></i>';
    } else {
        sexHTML = '<i class="ui-icon-female"></i>'
    }
    let response = `
            <li class="ui-whitespace good">
                <div class="ui-border-t good-tag">
                    ${tagsToHTML(message.tags)}
                </div>
                <a href="/market/user/good/${owner.openid}/${message.id}" class="good-link">
                    <div class="ui-row-flex">
                        <div class="ui-col">
                            <img class="good-banner" src="${message.picture[0]}" alt="首图">
                        </div>
                        <div class="ui-col ui-col-2 ui-row-flex ui-row-flex-ver good-content">
                            <div class="ui-col-2" style="height: 24px;">
                                <h1 class="ui-nowrap-multi ui-flex-pack-start ui-col-3 good-topic">${message.describe}</h1>
                            </div>
                            <h2 class="ui-col good-price" style="height: 24px;">¥${message.price}<i class="good-cost">¥${message.cost}</i></h2>
                        </div>
                    </div>
                    <ul class="ui-justify-flex good-message">
                        <li>
                            <div class="ui-row-flex">
                                <img class="ui-avatar" src="${owner.headimgurl}"></img>
                                <div class="good-message-owner">
                                    <div class="ui-flex ui-flex-align-start">
                                        <span>${owner.nickname}${sexHTML}</span>
                                    </div>
                                    <div class="ui-flex ui-flex-align-end">
                                        <span class="ui-txt-info">${message.date}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="ui-row-flex">
                                <i class="ui-icon-pin ui-txt-info"></i>
                                <span class="ui-flex ui-flex-align-center ui-txt-info">${message.address}</span>
                            </div>
                        </li>
                    </ul>
                </a>
            </li>`;

        return response;
}