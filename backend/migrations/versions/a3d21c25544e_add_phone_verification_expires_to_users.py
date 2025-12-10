"""add phone verification expires to users

Revision ID: a3d21c25544e
Revises: 7f98042bf759
Create Date: 2025-12-07 15:09:08.183827

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3d21c25544e'
down_revision: Union[str, Sequence[str], None] = '7f98042bf759'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        'users',
        sa.Column('phone_verification_expires', sa.DateTime(), nullable=True)
    )

def downgrade():
    op.drop_column('users', 'phone_verification_expires')
