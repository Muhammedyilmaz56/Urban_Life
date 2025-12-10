"""add phone fields to users

Revision ID: dfa294b58325
Revises: c5e8bb52cab5
Create Date: 2025-12-07 08:48:01.568541

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dfa294b58325'
down_revision: Union[str, Sequence[str], None] = 'c5e8bb52cab5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "users",
        sa.Column(
            "is_phone_verified",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
    )
    op.add_column(
        "users",
        sa.Column("phone_verification_code", sa.String(length=6), nullable=True),
    )


def downgrade():
    op.drop_column("users", "phone_verification_code")
    op.drop_column("users", "is_phone_verified")