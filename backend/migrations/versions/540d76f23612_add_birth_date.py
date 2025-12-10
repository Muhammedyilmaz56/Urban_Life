"""add_birth_date

Revision ID: 540d76f23612
Revises: dfa294b58325
Create Date: 2025-12-07 09:39:20.132885

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import Date


# revision identifiers, used by Alembic.
revision: str = '540d76f23612'
down_revision: Union[str, Sequence[str], None] = 'dfa294b58325'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column("users", sa.Column("birth_date", Date(), nullable=True))

def downgrade():
    op.drop_column("users", "birth_date")