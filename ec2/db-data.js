const Db = require('./db');
const squel = require('squel').useFlavour('postgres');

class DbData extends Db {
  constructor ({url, logger}) {
    super({url, logger});
    this.name = 'DbData';
  }

  async updateInvocations(name) {
    if (!this.connected) {
      this.logger.error('[DbData] cannot perform updateInvocations() operation in disconnected state');
      return null;
    }
    const query1 = squel.select()
      .from('invocations')
      .field('count')
      .where('id = ?', name)
      .toParam();
    let res1;
    let time1 = Date.now();
    try {
      res1 = await this.db.oneOrNone(query1);
      time1 = Date.now() - time1;
      res1 = res1 ? res1.count : 0;
    } catch (e) {
      this.logger.error('[DbData] error during updateInvocations() method');
      return null;
    }
    res1 = res1 + 1;
    const query2 = squel.insert()
      .into('invocations')
      .set('id', name)
      .set('count', res1)
      .onConflict('id', { id: name, count: res1 })
      .toParam();
    let time2 = Date.now();
    try {
      await this.db.none(query2);
      time2 = Date.now() - time2;
      return {
        table: 'invocations',
        count: res1,
        read: time1,
        write: time2
      };
    } catch (e) {
      this.logger.error('[DbData] error during updateInvocations() method');
      return null;
    }
  }
};

module.exports = DbData;
