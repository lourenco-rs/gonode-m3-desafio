const kue = require('kue')
const Sentry = require('@sentry/node')
const redisConfig = require('../../config/redis')
const jobs = require('../jobs')

const Queue = kue.createQueue({ redis: redisConfig })

/**
 * estamos instruindo o Node a processar todos os jobs que tenham a
 * key jobs.PurchaseMail.key e chamar o método handle.
 * Então, para todo job disparado com essa key, será chamado o método handle,
 * que irá finalizar o job
 */
Queue.process(jobs.PurchaseMail.key, jobs.PurchaseMail.handle)

Queue.on('error', Sentry.captureException)

module.exports = Queue
