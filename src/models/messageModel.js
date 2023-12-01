
const db = require('../../dbcon');

class MessageModel {
    static #sender_id = null;
    static #receiver_id = null;
    static #messageContent = null;
    static #timestamp = null;

    static sendMessage(callback) {
        try {
            const dbCon = db();
            dbCon.connect((err) => {
                if (err) {
                    return callback(err, null);
                }

                let desc = `You have a new message. '${this.#messageContent}'`;
                const insertMessageQuery = `INSERT INTO message (from_user_id, to_user_id, message_body) VALUES (${this.#sender_id}, ${this.#receiver_id}, "${this.#messageContent}");`;
                const insertNotificationQuery = `INSERT INTO notification (user_id, description, is_read) VALUES (${this.#receiver_id}, "${desc}", 0);`;

                dbCon.query(insertMessageQuery, (err, result) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                });
                dbCon.query(insertNotificationQuery, (err, result) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, true);
                    }
                });
            });
        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

    static async setParams (sender, receiver, messageBody) {
        if (!sender || !receiver || !messageBody) {
            return false;
        }
        if (sender == receiver) {
            return false;
        }
        // const foul_words = await verify_foul(messageBody);
        // if (foul_words.length > 0) {
        //     return false;
        // }
        this.#sender_id = sender;
        this.#receiver_id = receiver;
        this.#messageContent = messageBody;
        let now = new Date();
        this.#timestamp = now.toISOString();
    }
}

module.exports = MessageModel;