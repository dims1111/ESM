import logging
import sqlparse
import pygments
from pygments.lexers import SqlLexer
from pygments.formatters import TerminalTrueColorFormatter

# sql로깅 관련 클래스, 위치 변경될 예정
class SQLFormatter(logging.Formatter):
    def format(self, record):
        # 줄끝 공백 제거
        sql = record.sql.strip()

        # 쿼리 정렬
        sql = sqlparse.format(sql, reindent=True, comma_first=True)

        # Highlight 
        # pygments.STYLE_MAP 참조
        sql = pygments.highlight(
            sql,
            SqlLexer(),
            TerminalTrueColorFormatter(style='manni') 
        )

        record.statement = sql
        return super(SQLFormatter, self).format(record)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'sql': {
            '()': SQLFormatter,
            'format': '%(statement)sparams : %(params)s, duration : %(duration).3fs\n', #             'format': '[%(duration).3f] %(statement)s',
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
        'sql': {
            'class': 'logging.StreamHandler',
            'formatter': 'sql',
            'level': 'DEBUG',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['sql'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.db.backends.schema': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    }
}