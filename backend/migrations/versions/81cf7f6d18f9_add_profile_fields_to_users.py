"""add profile fields to users

Revision ID: 81cf7f6d18f9
Revises: 46353c52b481
Create Date: 2025-12-03 15:05:26.835455

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



revision: str = '81cf7f6d18f9'
down_revision: Union[str, Sequence[str], None] = '46353c52b481'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        'users',
        sa.Column('tc_kimlik_no', sa.String(length=11), nullable=True),
    )
    op.add_column(
        'users',
        sa.Column('birth_year', sa.Integer(), nullable=True),
    )
    op.add_column(
        'users',
        sa.Column('phone_number', sa.String(), nullable=True),
    )
    op.add_column(
        'users',
        sa.Column(
            'is_name_public',
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )
    op.add_column(
        'users',
        sa.Column('avatar_url', sa.String(), nullable=True),
    )
    op.add_column(
        'users',
        sa.Column(
            'profile_completed',
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )
    op.add_column(
        'users',
        sa.Column(
            'updated_at',
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

   
    op.create_unique_constraint(
        'uq_users_tc_kimlik_no',
        'users',
        ['tc_kimlik_no'],
    )


def downgrade():
    op.drop_constraint('uq_users_tc_kimlik_no', 'users', type_='unique')
    op.drop_column('users', 'updated_at')
    op.drop_column('users', 'profile_completed')
    op.drop_column('users', 'avatar_url')
    op.drop_column('users', 'is_name_public')
    op.drop_column('users', 'phone_number')
    op.drop_column('users', 'birth_year')
    op.drop_column('users', 'tc_kimlik_no')