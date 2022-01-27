import { DateTime } from 'luxon';

export const localeDateNowSQL = () => DateTime.local({ zone: 'Japan/Tokyo' }).toSQL();
