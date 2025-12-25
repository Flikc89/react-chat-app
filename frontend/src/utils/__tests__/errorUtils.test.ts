import { getErrorMessage } from '../errorUtils';
import axios from 'axios';

describe('errorUtils', () => {
  describe('getErrorMessage', () => {
    it('возвращает сообщение об ошибке из Axios response', () => {
      const error = {
        response: {
          data: {
            error: 'Кастомная ошибка',
          },
        },
      };

      const message = getErrorMessage(error);

      expect(message).toBe('Кастомная ошибка');
    });

    it('возвращает message если ошибка не Axios, но есть message', () => {
      const error = new Error('Обычная ошибка');

      const message = getErrorMessage(error);

      expect(message).toBe('Обычная ошибка');
    });

    it('возвращает undefined если нет response.data.error', () => {
      const error = {
        response: {
          data: {},
        },
      };

      const message = getErrorMessage(error);

      expect(message).toBeUndefined();
    });

    it('возвращает message если есть message, но нет response', () => {
      const error = {
        message: 'Ошибка без response',
      };

      const message = getErrorMessage(error);

      expect(message).toBe('Ошибка без response');
    });

    it('возвращает undefined для null', () => {
      const message = getErrorMessage(null);

      expect(message).toBeUndefined();
    });

    it('возвращает undefined для undefined', () => {
      const message = getErrorMessage(undefined);

      expect(message).toBeUndefined();
    });

    it('возвращает undefined если нет message и нет response', () => {
      const error = {
        code: 'SOME_ERROR',
      };

      const message = getErrorMessage(error);

      expect(message).toBeUndefined();
    });
  });
});

