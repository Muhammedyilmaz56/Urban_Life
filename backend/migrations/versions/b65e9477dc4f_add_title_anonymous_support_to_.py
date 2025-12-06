"""add title anonymous support to complaints

Revision ID: b65e9477dc4f
Revises: 81cf7f6d18f9
Create Date: 2025-12-03 15:37:38.265045

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



revision: str = 'b65e9477dc4f'
down_revision: Union[str, Sequence[str], None] = '81cf7f6d18f9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        'complaints',
        sa.Column('title', sa.String(), nullable=True),
    )
    op.add_column(
        'complaints',
        sa.Column(
            'is_anonymous',
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )
    op.add_column(
        'complaints',
        sa.Column(
            'support_count',
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
    )


def downgrade():
    op.drop_column('complaints', 'support_count')
    op.drop_column('complaints', 'is_anonymous')
    op.drop_column('complaints', 'title')
