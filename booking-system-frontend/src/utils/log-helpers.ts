import { ApplicationShareData } from '@/common/config/AppShareData'
import pino from 'pino'


const LogHelper = pino({
  level: ApplicationShareData.isDevelopmentMode ? 'debug' : 'silent',
  browser: {
    serialize: true,
    asObject: true
    // transmit: {
    //   send
    // }
  },
  timestamp: pino.stdTimeFunctions.isoTime
})
export default LogHelper
