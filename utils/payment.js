const handleError = err => {
    console.log(`Warning: ${err.message}`);
    return false;
};

class PaymentFiller {
    constructor(checkBoxElementKey) {
        this.checkBoxElementKey = checkBoxElementKey;
    }

    async fill(data, page, elm_form) {
        if (!elm_form[this.checkBoxElementKey]) return false;
        const result = await page.$eval(elm_form[this.checkBoxElementKey], el => el.click()).catch(handleError);
        if (result === false) return false;
        this.postProcess(data, page, elm_form);
        return true;
    }

    postProcess(data, page, elm_form) {
        page.waitFor(500);
    }
}

class CreditCardFiller extends PaymentFiller { }

class PaygentFiller extends CreditCardFiller{
    async fill(data, page, elm_form) {
        const parentResult = await super.fill(data, page, elm_form);
        if (parentResult === false) return false;
        const token_elm = elm_form.submit_element;
        const card_token = data.card_token;
        const card_number = data.card_number;
        const result = await page.evaluate((token_elm, card_token, card_number) => {
            const form = document.querySelector(token_elm);
            const token_exec = document.createElement('INPUT');
            const token_savecard = document.createElement('INPUT');
            token_exec.setAttribute("type", "hidden");
            token_exec.setAttribute("name", "token[0]");
            token_exec.setAttribute("value", card_token);
            token_savecard.setAttribute("type", "hidden");
            token_savecard.setAttribute("name", "masked_card_number[0]");
            token_savecard.setAttribute("value", "************" + card_number);
            form.appendChild(token_exec);
            form.appendChild(token_savecard);
        }, token_elm, card_token, card_number).catch(handleError);

        return result !== false;
    }

    postProcess() {}
}

class GMOFiller extends CreditCardFiller {
    async fill(data, page, elm_form) {
        const parentResult = await super.fill(data, page, elm_form);
        if (parentResult === false) return false;
        return true;
    }
}

// クロネコWebコレクト
// id:113 スキンキュアにて実装
// もしかしたらスキンキュア固有の実装かもしれないため、他の案件でクロネコwebコレクトを使用する際に異常であれば修正してください
// 
class KuronekoWebFiller extends CreditCardFiller {
    async fill(data, page, elm_form, parentObject) {
        if (!parentObject) {
            const message = `Expect on KuronekoWebFiller
            fill(data, page, elm_form, parentObject)にParentObjectが渡されていないかfalse扱いです。
            HTMLを取得する必要があるため、Parentの実装クラスから呼び出す場合には第４引数にthisを渡してください.
            `;
            throw new Error(message);
        }

        const paymentParamsStr = await page.$eval(elm_form.credit_params_element, el => el ? el.getAttribute('value') : false);
        if (!paymentParamsStr) return false;
        const matcher = /'PaymentParams'\ :\ \[(.*)\]/;
        const matched = paymentParamsStr.match(matcher);
        if (!matched) return false;

        /*
        await page.evaluate(() => {
            getTokenAndSetToFormJs = "console.log('workd')";
            maskFormsForTokenJs = "console.log('hello')";
            postbackOverloadEvent = (postbackEvent) => postbackEvent();
        } );
        */


        const paymentParamStr = matched[1];
        const paymentParams = paymentParamStr.split(',');
        const firstData = paymentParams[0].replace(/'/g, '');
        const secondData = paymentParams[1].replace(/'/g, '');

        const parentResult = await super.fill(data, page, elm_form);
        if (parentResult === false) return false;
        const token_elm = elm_form.credit_token_element;
        const card_token = data.card_token;

        const token = firstData + ' ' + secondData + ' ' + card_token;

        await parentObject.typeElement(page, [
            { element: elm_form.credit_number_first_element, value: '4111', type: 'text'},
            { element: elm_form.credit_number_second_element, value: '1111', type: 'text'},
            { element: elm_form.credit_number_third_element, value: '1111', type: 'text'},
            { element: elm_form.credit_number_forth_element, value: '1111', type: 'text'},
            { element: elm_form.credit_name_element, value: 'TEST TEST', type: 'text' },
            { element: elm_form.credit_secure_code_element, value: '745', type: 'text' },
        ]);

        const result = await page.evaluate((token_elm, token, card_number) => {
            const token_input = document.querySelector(token_elm);
            token_input.setAttribute('value', token);
        }, token_elm, token).catch(handleError);
        return result !== false;
    }

    postProcess() {}
}

module.exports = {
    PaymentFiller,
    CreditCardFiller,
    PaygentFiller,
    GMOFiller,
    KuronekoWebFiller
}
