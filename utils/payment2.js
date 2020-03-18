const handleError = err => {
    console.error(err);
    return false;
};

class PaymentFiller {
    constructor(elementKey) {
        this.elementKey = elementKey;
    }

    async fill(data, page, elm_form, type) {
        if (!elm_form[this.elementKey]) return false;
        var result = '';
        console.log(elm_form[this.elementKey]);
        switch (type) {
            case 'select':
                result = await page.select(elm_form[this.elementKey], data.payment_type);
                break;

            case 'click':
                result = await page.$eval(elm_form[this.elementKey], el => el.click()).catch(handleError);
                break;

            default:
                break;
        }
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
    async fill(data, page, elm_form, type) {
        const parentResult = await super.fill(data, page, elm_form, type);
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

module.exports = {
    PaymentFiller,
    CreditCardFiller,
    PaygentFiller
}
