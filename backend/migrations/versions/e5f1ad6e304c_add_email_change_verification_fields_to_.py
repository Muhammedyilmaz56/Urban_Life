"""Add email change verification fields to users

Revision ID: e5f1ad6e304c
Revises: e886537c2c8d
Create Date: 2025-12-15 08:11:15.273140

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



revision: str = 'e5f1ad6e304c'
down_revision: Union[str, Sequence[str], None] = 'e886537c2c8d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column("users", sa.Column("email_change_pending", sa.String(), nullable=True))
    op.add_column("users", sa.Column("email_change_code_hash", sa.String(), nullable=True))
    op.add_column("users", sa.Column("email_change_expires", sa.DateTime(), nullable=True))


def downgrade():
    op.drop_column("users", "email_change_expires")
    op.drop_column("users", "email_change_code_hash")
    op.drop_column("users", "email_change_pending")