"""add password reset fields

Revision ID: 9e5a101915ed
Revises: 59e32273c7c0
Create Date: 2025-12-02 17:53:07.083482

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



revision: str = '9e5a101915ed'
down_revision: Union[str, Sequence[str], None] = '59e32273c7c0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    
    op.add_column(
        'users',
        sa.Column('reset_password_token', sa.String(), nullable=True)
    )
    op.add_column(
        'users',
        sa.Column('reset_password_expires', sa.DateTime(), nullable=True)
    )


def downgrade() -> None:
    
    op.drop_column('users', 'reset_password_expires')
    op.drop_column('users', 'reset_password_token')
